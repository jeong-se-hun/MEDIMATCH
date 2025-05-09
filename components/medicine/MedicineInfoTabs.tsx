"use client";
import { useState } from "react";
import { MedicineItem } from "@/types/medicine";

enum MedicineInfoTab {
  Efficacy = "효능·효과",
  Usage = "용법·용량",
  Precautions = "주의사항",
  Interaction = "상호작용",
  SideEffects = "부작용",
  Storage = "보관방법",
}

const tabDataKeyMap: Record<MedicineInfoTab, keyof MedicineItem> = {
  [MedicineInfoTab.Efficacy]: "efcyQesitm",
  [MedicineInfoTab.Usage]: "useMethodQesitm",
  [MedicineInfoTab.Precautions]: "atpnQesitm",
  [MedicineInfoTab.Interaction]: "intrcQesitm",
  [MedicineInfoTab.SideEffects]: "seQesitm",
  [MedicineInfoTab.Storage]: "depositMethodQesitm",
};

const tabDisplayNames = Object.values(MedicineInfoTab);

type MedicineInfoTabsProps = {
  medicine: MedicineItem | null;
};

export default function MedicineInfoTabs({ medicine }: MedicineInfoTabsProps) {
  const [activeTab, setActiveTab] = useState<MedicineInfoTab>(
    MedicineInfoTab.Efficacy
  );

  const activeDataKey = tabDataKeyMap[activeTab];
  const currentContent = medicine?.[activeDataKey];

  return (
    <div className="mt-6 flex flex-col gap-3">
      {/* 탭 버튼 목록 */}
      <div
        className="flex overflow-x-auto gap-1"
        role="tablist"
        aria-label="의약품 상세 정보"
      >
        {tabDisplayNames.map((tabName) => (
          <button
            key={tabName}
            id={`tab-button-${tabName}`}
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap text-sm font-medium transition-colors ${
              activeTab === tabName
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-selected={activeTab === tabName}
            role="tab"
          >
            {tabName}
          </button>
        ))}
      </div>

      {/* 탭 내용 표시 영역 */}
      <div
        id={`tab-panel-${activeTab}`}
        className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm"
        role="tabpanel"
        aria-labelledby={`tab-button-${activeTab}`}
      >
        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {currentContent || `${activeTab} 정보가 제공되지 않았습니다.`}
        </div>
      </div>
    </div>
  );
}
