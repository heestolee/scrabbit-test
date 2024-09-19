import React from "react";

function InputArea({ deployMode, url, setUrl, customContent, setCustomContent, handleFetch }) {
  return (
    <div className="flex flex-col items-center p-4 w-full max-w-md">
      {deployMode === "url" ? (
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Notion page URL"
          className="border p-2 rounded w-full"
        />
      ) : (
        <textarea
          value={customContent}
          onChange={(e) => setCustomContent(e.target.value)}
          placeholder="여기에 배포할 콘텐츠를 입력하세요"
          className="border p-2 rounded w-full"
          rows="10"
        />
      )}
      <button
        onClick={handleFetch}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full mt-4"
      >
        Get Notion Data
      </button>
    </div>
  );
}

export default InputArea;
