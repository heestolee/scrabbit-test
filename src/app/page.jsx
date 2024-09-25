"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import DeployModeSelector from "@/components/DeployModeSelector";
import InputArea from "@/components/InputArea";
import NotionPageRenderer from "@/components/NotionPageRenderer";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

export default function Home() {
  const [deployMode, setDeployMode] = useState("url");
  const [url, setUrl] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [notionPageId, setNotionPageId] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const renderSectionRef = useRef(null);

  const handleFetch = () => {
    if (!url) {
      alert("Notion URL을 입력하세요.");
      return;
    }

    setIsLoading(true);
    const pageId = url.split("/").pop();
    setNotionPageId(pageId);
    setPreviewMode(true);
  };

  const handleSnapshotReady = () => {
    setIsLoading(false);
    renderSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeploy = async () => {
    if (!subdomain) {
      alert("Enter your subdomain");
      return;
    }

    try {
      const notionUrl = url;
      const apiEndpoint = deployMode === "partial" ? "/api/deploy-partial" : "/api/deploy";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notionPageId,
          subdomain,
          notionUrl,
          deployMode,
          selectedBlocks,
        }),
      });

      if (!response.ok) throw new Error("배포에 실패했습니다.");
      const data = await response.json();

      setModalMessage(`배포 완료! 배포된 사이트: ${data.url}`);
      setIsModalOpen(true);
    } catch (error) {
      console.error("배포 중 오류 발생:", error);
      setModalMessage("배포에 실패했습니다. 다시 시도해주세요.");
      setIsModalOpen(true);
    }
  };

  const handleSelectBlock = (blockId) => {
    setSelectedBlocks((prev) => ({
      ...prev,
      [blockId]: !prev[blockId],
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minH="100vh" bg="gray.100">
      <Image
        src="/notiondrop.png"
        alt="notiondrop logo"
        width={800}
        height={400}
      />
      <DeployModeSelector deployMode={deployMode} setDeployMode={setDeployMode} />
      <InputArea
        deployMode={deployMode}
        url={url}
        setUrl={setUrl}
        handleFetch={handleFetch}
        isLoading={isLoading}
      />

      {previewMode && (
        <Box ref={renderSectionRef} display="flex" flexDirection="column" alignItems="center" p={4} w="full">
          {notionPageId && (
            <NotionPageRenderer
              notionPageId={notionPageId}
              deployMode={deployMode}
              onSnapshotReady={handleSnapshotReady}
              selectedBlocks={selectedBlocks}
              handleSelectBlock={handleSelectBlock}
            />
          )}
          <Box display="flex" mt={4} w="full" maxW="md">
            <Input
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder="custom domain"
              bg={"white"}
              size="sm"
              mr={2}
              borderRadius="md"
            />
            <span>.notiondrop.site</span>
          </Box>
          <Button onClick={handleDeploy} colorScheme="green" width="25rem" mt={4}>
            Deploy
          </Button>
        </Box>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
        <ModalOverlay width={"100%"} height={"100%"}/>
        <ModalContent>
          <ModalHeader>배포 결과</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalMessage}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
