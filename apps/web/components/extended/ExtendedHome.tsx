'use client';

import React from 'react';

export default function ExtendedHome() {
  return (
    <div>
      {/* 로고 영역 */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-light tracking-wider text-gray-800">
          NIN<span className="text-[#3071a5]">E</span>
        </h1>
        <h1 className="text-5xl font-light tracking-wider text-gray-800">
          BRIDG<span className="text-[#3071a5]">E</span>
        </h1>
        <p className="text-sm text-gray-500 mt-3">주식회사 나인브릿지</p>
      </div>

      {/* 슬로건 */}
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          "누구나 만들 수는 없지만,<br />
          누군가는 꼭 만들고 있는 것들"
        </h2>
        <p className="text-gray-600 leading-relaxed">
          단지 팔기 위한 물건이 아니라, 살아가는 이야기를 담은 상품입니다.
          사람의 손으로, 사람에게 닿도록 전합니다.
          지금, 그 진심이 당신에게 가장 가까이 전해집니다.
        </p>
      </div>

      {/* 회사 연혁 */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">회사 연혁</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-20 text-sm font-medium text-[#3071a5]">2025</div>
            <div className="text-gray-600">나인브릿지 법인 설립 (웹/앱 개발 사업 확장)</div>
          </div>
          <div className="flex gap-4">
            <div className="w-20 text-sm font-medium text-[#3071a5]">2022</div>
            <div className="text-gray-600">나인커머스 설립 (마케팅 사업 확장)</div>
          </div>
          <div className="flex gap-4">
            <div className="w-20 text-sm font-medium text-[#3071a5]">2015</div>
            <div className="text-gray-600">리버브나인 설립 (행사기획 시작)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
