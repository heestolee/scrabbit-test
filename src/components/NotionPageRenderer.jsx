"use client";

import React, { useEffect, useState } from "react";
import { NotionRenderer } from 'react-notion-x';

export default function NotionPageRenderer({ notionPageId }) {
  const [recordMap, setRecordMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPageContent = async (pageId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/notion/${pageId}`);
      if (!response.ok) throw new Error('노션 페이지 페칭 실패');
      const data = await response.json();
      setRecordMap(data.recordMap);
    } catch (error) {
      console.error("노션 페이지 페칭 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (notionPageId) fetchPageContent(notionPageId);
  }, [notionPageId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recordMap) {
    return <div>노션 데이터 가져오기 실패</div>;
  }

  return (
    <section className="notion-container w-full">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        components={{
          block: ({ block }) => {
            if (block.type === 'unsupported') {
              return <CustomBlockRenderer block={block} />;
            }
            return null;
          }
        }}
      />
    </section>
  );
}
