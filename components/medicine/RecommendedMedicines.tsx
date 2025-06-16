"use client";
import { IngredientItem, MedicineItem } from "@/types/medicine";
import { useState } from "react";
import RecommendedByIngredient from "@/components/medicine/RecommendedByIngredient";
import RecommendedByEfficacy from "./RecommendedByEfficacy";

export type RecommendedMedicinesProps = {
  ingredient: IngredientItem | null;
  medicine: MedicineItem;
};

enum RecommendationTab {
  Ingredient = "성분",
  Efficacy = "효능",
}

const TABS = [
  {
    id: RecommendationTab.Ingredient,
    label: "동일 성분 약품",
    panelId: "ingredient-panel",
    buttonId: "ingredient-tab",
  },
  {
    id: RecommendationTab.Efficacy,
    label: "동일 효능 약품",
    panelId: "efficacy-panel",
    buttonId: "efficacy-tab",
  },
];

export default function RecommendedMedicines({
  ingredient,
  medicine,
}: RecommendedMedicinesProps) {
  const [recommendTab, setRecommendTab] = useState<RecommendationTab>(
    RecommendationTab.Ingredient
  );

  const handleTabChange = (tab: RecommendationTab) => {
    setRecommendTab(tab);
  };

  return (
    <>
      {/* 영역 구분선  */}
      <div className="relative h-24 overflow-hidden bg-gray-50">
        <div className="max-w-4xl mx-auto px-5 pt-10">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-xl font-bold text-gray-700">추천 약품</h2>
          </div>
        </div>
      </div>

      <section className="py-8 bg-gray-50 grow">
        <div className="max-w-4xl mx-auto px-5">
          {/* 탭 UI */}
          <div className="mb-6">
            <div
              className="inline-flex bg-white rounded-lg p-1 shadow-sm border border-gray-100"
              role="tablist"
              aria-label="추천 약품"
            >
              {TABS.map((tabInfo) => (
                <button
                  key={tabInfo.id}
                  id={tabInfo.buttonId}
                  onClick={() => handleTabChange(tabInfo.id)}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    recommendTab === tabInfo.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  role="tab"
                  aria-selected={recommendTab === tabInfo.id}
                  aria-controls={tabInfo.panelId}
                >
                  {tabInfo.label}
                </button>
              ))}
            </div>
          </div>

          {/* 탭 내용 */}
          {TABS.map((tabInfo) => (
            <div
              key={tabInfo.panelId}
              id={tabInfo.panelId}
              role="tabpanel"
              aria-labelledby={tabInfo.buttonId}
              hidden={recommendTab !== tabInfo.id}
            >
              {tabInfo.id === RecommendationTab.Ingredient && (
                <RecommendedByIngredient
                  ingredient={ingredient}
                  medicine={medicine}
                />
              )}
              {tabInfo.id === RecommendationTab.Efficacy && (
                <RecommendedByEfficacy medicine={medicine} />
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
