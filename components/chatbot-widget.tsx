"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useHyperFlow } from "@hyperflow/client-sdk/react";

type UiMsg = { role: "user" | "bot"; content: string };
type SdkConfig = { baseURL: string; flowGraphID: string };

// ------------ 상위: 버튼만 렌더, 클릭 시에만 초기화 ------------
export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [cfg, setCfg] = useState<SdkConfig | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const hasInitialized = useRef(false);

  // 버튼 클릭 시에만 설정 로드 및 초기화
  const handleOpenChat = async () => {
    if (hasInitialized.current) {
      setIsOpen(true);
      return;
    }

    setIsInitializing(true);
    try {
      const res = await fetch("/api/hyperflow/config");
      const data = await res.json();
      console.log("✅ HyperFlow Config:", data);
      if (!data?.baseURL || !data?.flowGraphID)
        throw new Error("Bad SDK config");
      setCfg({ baseURL: data.baseURL, flowGraphID: data.flowGraphID });
      hasInitialized.current = true;
      setIsOpen(true);
    } catch (e) {
      console.error("❌ [SDK CONFIG ERROR]", e);
      alert("챗봇을 초기화하는 중 오류가 발생했습니다.");
    } finally {
      setIsInitializing(false);
    }
  };

  // 설정이 로드되고 열렸을 때만 SDK 컴포넌트 렌더
  if (!isOpen || !cfg) {
    return (
      <Button
        onClick={handleOpenChat}
        disabled={isInitializing}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
        size="icon"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    );
  }

  // cfg가 바뀌면 하위 컴포넌트를 remount해서 SDK 인스턴스를 교체
  const key = `${cfg.baseURL}:${cfg.flowGraphID}`;
  return <HyperFlowChat key={key} cfg={cfg} onClose={() => setIsOpen(false)} />;
}

// ------------ 하위: 실제 SDK 구동 (열렸을 때만 마운트됨) ------------
function HyperFlowChat({ cfg, onClose }: { cfg: SdkConfig; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<UiMsg[]>([
    { role: "bot", content: "안녕하세요! 목구멍입니다. 무엇을 도와드릴까요?" },
  ]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const {
    messages: sdkMsgs,
    sendMessage,
    isReady,
    isGenerating,
    start,
    reset,
    fileUploadInteractionSpec,
    uploadFile,
    promptInteractionSpec,
  } = useHyperFlow({
    // ⬇️ 처음 mount될 때부터 올바른 프록시 baseURL을 사용
    baseURL: cfg.baseURL, // "/api/hyperflow/proxy"
    apiKey: "proxy", // 서버 프록시가 X-API-Key 주입
    flowGraphID: cfg.flowGraphID,
    autoStart: false, // ❗️중요: 자동 시작 금지
    debug: true,
  });

  // 컴포넌트가 마운트될 때 한 번만 start (버튼 클릭 시에만 마운트되므로)
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    console.log("Initializing SDK with:", cfg.baseURL, cfg.flowGraphID);
    (async () => {
      try {
        reset();
        await start();
        console.log("✅ SDK started successfully");
      } catch (err: any) {
        console.error("❌ [SDK START ERROR]", err);
        
        // Extract error message from response if available
        let errorMessage = "⚠️ 연결 오류가 발생했습니다. 다시 시도해주세요.";
        
        if (err?.message) {
          const errMsg = err.message.toLowerCase();
          if (errMsg.includes("quota") || errMsg.includes("quotaexceeded")) {
            errorMessage = "⚠️ API 호출 한도가 초과되었습니다. Hyperflow 대시보드에서 할당량을 확인해주세요.";
          } else if (errMsg.includes("api key") || errMsg.includes("authentication")) {
            errorMessage = "⚠️ API 키 인증 오류가 발생했습니다. 환경 변수를 확인해주세요.";
          } else if (errMsg.includes("flowgraph") && errMsg.includes("published")) {
            errorMessage = "⚠️ Flowgraph가 API 제어를 위해 게시되지 않았습니다. Hyperflow 대시보드에서 게시해주세요.";
          }
        }
        
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: errorMessage },
        ]);
      }
    })();
  }, [cfg.baseURL, cfg.flowGraphID, reset, start]);

  const suppressFirstBotRef = useRef(true);
  // SDK 메시지 → UI 동기화
  useEffect(() => {
    const ui: UiMsg[] = [];

    for (const m of sdkMsgs) {
      const text = m.text.toLowerCase() || "";

      if (
        m.type == "system" ||
        text.includes("Greetings from") ||
        text.includes("helper")
      ) {
        continue;
      }
      if (m.type === "user") {
        if (m.text) ui.push({ role: "user", content: m.text });
      } else if (
        m.type === "generator" ||
        m.type === "streamedGenerator" ||
        m.type === "message"
      ) {
        if (suppressFirstBotRef.current) {
          suppressFirstBotRef.current = false;
          continue;
        }
        if (m.text) ui.push({ role: "bot", content: m.text });
      } else if (m.type === "error") {
        ui.push({
          role: "bot",
          content: "⚠️ 오류가 발생했습니다. 다시 시도해주세요.",
        });
      }
    }
    setMessages((prev) => {
      const header = prev.length && prev[0].role === "bot" ? [prev[0]] : [];
      return [...header, ...ui];
    });
  }, [sdkMsgs]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (file: File) => {
    setPendingFiles((prev) => [...prev, file]);
    setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
  };
  const removePendingAt = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSend = async () => {
    const text = input.trim();
    const hasText = !!text;
    const hasFiles = pendingFiles.length > 0;
    if (!hasText && !hasFiles) return;
    if (!isReady || isGenerating) return;

    setSending(true);
    setInput("");

    try {
      // (A) 파일 업로드는 플로우가 허용할 때만
      if (hasFiles && fileUploadInteractionSpec) {
        const file = pendingFiles[0];
        const formData = new FormData();
        formData.append("org_id", fileUploadInteractionSpec.orgID);
        formData.append("file", file);

        // 프록시 경유 업로드
        const uploadRes = await fetch(
          "/api/hyperflow/proxy/hyperflow/uploadContent",
          {
            method: "POST",
            body: formData,
          }
        );
        if (!uploadRes.ok)
          throw new Error(`Upload failed: ${uploadRes.status}`);
        const { data } = await uploadRes.json(); // { uploads, filename }
        await uploadFile(file, data.uploads, data.filename);
      }

      // (B) 텍스트 전송 (없으면 트리거용 문구)
      await sendMessage(hasText ? text : "(첨부 파일 전송)");
    } catch (err) {
      console.error("❌ [CHAT ERROR]", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ 오류가 발생했습니다. 다시 시도해주세요." },
      ]);
    } finally {
      setSending(false);
      pendingFiles.forEach((_, i) => URL.revokeObjectURL(previews[i]));
      setPendingFiles([]);
      setPreviews([]);
    }
  };

  const handleNewChat = async () => {
    setMessages([
      {
        role: "bot",
        content: "안녕하세요! 목구멍입니다. 무엇을 도와드릴까요?",
      },
    ]);
    suppressFirstBotRef.current = true;
    reset();
    await start();
  };

  return (
    <Card className="fixed bottom-8 right-8 w-96 h-[640px] flex flex-col shadow-2xl border-0 z-50">
      <div className="flex items-center justify-between p-6 border-b bg-primary text-primary-foreground rounded-t-xl">
        <h3 className="font-bold text-lg">목구멍 챗봇</h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleNewChat}
            variant="secondary"
            size="sm"
            className="h-7 text-xs"
          >
            새 대화
          </Button>
          <button
            onClick={onClose}
            className="hover:bg-primary-foreground/20 rounded-full p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/30">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground border"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {previews.length > 0 && (
          <div className="px-6">
            <div className="text-xs text-gray-500 mb-2">
              전송 대기 중 파일
            </div>
            <div className="grid grid-cols-3 gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={src}
                    alt={`pending-${i}`}
                    className="rounded-md border object-cover w-full h-20"
                  />
                  <button
                    onClick={() => removePendingAt(i)}
                    className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center
                               h-6 w-6 rounded-full bg-black/60 text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-6 pt-3">
        <label className="flex items-center gap-2 cursor-pointer w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-muted/40 transition">
          <Upload className="h-4 w-4" />
          파일 선택 (업로드 준비)
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = (e.target as HTMLInputElement).files?.[0];
              if (f) handleFileSelect(f);
              (e.target as HTMLInputElement).value = "";
            }}
          />
        </label>
      </div>

      <div className="p-6 border-t bg-background rounded-b-xl">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              promptInteractionSpec?.placeholder || "메시지를 입력하세요..."
            }
            className="rounded-full px-5"
            disabled={sending || !isReady || isGenerating}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="rounded-full h-11 w-11"
            disabled={sending || !isReady || isGenerating}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
