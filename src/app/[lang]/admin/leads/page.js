"use client";

import { useState } from "react";
import { mockLeads, mockPipelineStages } from "@/lib/mock-data";

function LeadCard({ lead, onDragStart }) {
  const paymentColor =
    lead.paymentStatus === "Đã thanh toán" ? "bg-primary-container/10 text-primary-container" :
    lead.paymentStatus === "Chờ chuyển khoản" ? "bg-secondary/10 text-secondary" :
    "bg-outline/10 text-slate-subtext";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      className="glass-card rounded-xl p-4 cursor-grab active:cursor-grabbing space-y-3 hover:border-primary-container/30 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-subtext/30 text-base">drag_indicator</span>
          <p className="font-headline-sub text-headline-sub text-ink-text text-sm">{lead.name}</p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="font-body-md text-slate-subtext text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">phone</span>
          {lead.phone}
        </p>
        <p className="font-body-md text-slate-subtext text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">mail</span>
          {lead.email}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="bg-mist-bg text-slate-subtext text-[10px] font-bold px-2 py-0.5 rounded-full border border-border-subtle">
          {lead.campaign}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paymentColor}`}>
          {lead.paymentStatus}
        </span>
      </div>
    </div>
  );
}

export default function LeadsKanban() {
  const [leads, setLeads] = useState(mockLeads);
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(stageId);
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    setLeads((prev) =>
      prev.map((l) => (l.id === dragId ? { ...l, stage: stageId } : l))
    );
    setDragId(null);
    setDragOver(null);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setDragOver(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">Quản lý CRM</h1>
          <p className="font-body-md text-slate-subtext mt-1">Kéo thả để chuyển giai đoạn</p>
        </div>
        <button className="bg-primary-container text-white px-5 py-2.5 rounded-full font-button-text text-button-text text-sm hover:scale-105 transition-transform flex items-center gap-2">
          <span className="material-symbols-outlined text-base">add</span>
          Thêm lead
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {mockPipelineStages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          const isOver = dragOver === stage.id;
          return (
            <div
              key={stage.id}
              className="flex flex-col gap-3 min-w-[300px] w-[300px]"
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
              onDragLeave={() => setDragOver(null)}
            >
              {/* Column Header */}
              <div className={`px-4 py-3 rounded-xl border transition-all ${
                isOver ? "bg-primary-container/10 border-primary-container/40" : "bg-white/80 border-border-subtle"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-button-text text-button-text text-ink-text uppercase text-xs">{stage.label}</span>
                  <span className="w-6 h-6 rounded-full bg-primary-container/10 text-primary-container font-black text-xs flex items-center justify-center">
                    {stageLeads.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div
                className={`flex flex-col gap-2 min-h-[200px] p-2 rounded-xl transition-all ${
                  isOver ? "bg-primary-container/5 ring-2 ring-primary-container/20" : "bg-transparent"
                }`}
                onDragEnd={handleDragEnd}
              >
                {stageLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onDragStart={handleDragStart} />
                ))}
                {stageLeads.length === 0 && (
                  <div className="flex-1 flex items-center justify-center rounded-xl border-2 border-dashed border-border-subtle min-h-[100px]">
                    <p className="font-body-md text-slate-subtext/40 text-sm text-center">Thả card vào đây</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
