"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import DeployModeSelector from "@/components/DeployModeSelector";
import UrlInputArea from "@/components/UrlInputArea";
import NotionPageRenderer from "@/components/NotionPageRenderer";
import DomainInputArea from "@/components/DomainInputArea";
import DeployPreviewRenderer from "@/components/DeployPreviewRenderer";
import LoadingAnimation from "@/components/LoadingAnimaition";

import { motion } from "framer-motion";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"

export default function Home() {
  const [deployMode, setDeployMode] = useState("full");
  const [url, setUrl] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [notionPageId, setNotionPageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState({});
  const [selectedBlocksHtml, setSelectedBlocksHtml] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isRendered, setIsRendered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const renderSectionRef = useRef(null);

  const handleFetch = () => {
    if (!url) {
      alert("Notion URL을 입력하세요.");
      return;
    }

    setIsLoading(true);
    const pageId = url.split("/").pop();
    setNotionPageId(pageId);
  };

  const handleSnapshotReady = () => {
    setIsLoading(false);
    setIsRendered(true);
  };

  const handleDeploy = async () => {
    if (!subdomain) {
      alert("Enter your subdomain");
      return;
    }

    try {
      const notionUrl = url;
      const apiEndpoint =
        deployMode === "partial" ? "/api/deploy-partial" : "/api/deploy";

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

      setModalMessage(`배포된 사이트: ${data.url}`);
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent={notionPageId ? "" : "center"}
      minH="100vh"
      bg="gray.100"
      overflowY="hidden"
    >
    <motion.div
      initial={{ zoom: 1, x: 0 }}
      animate={
        isRendered
          ? { zoom: 0.1, x:"-470vw" }
          : isLoading ? { zoom: 0.1 } : { zoom: 1 }
      }
      transition={{ duration: 0.8 }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        <Image
          src="/notiondrop.svg"
          alt="notiondrop logo"
          width={800}
          height={400}
        />
      </Box>
    </motion.div>
      <Box display="flex" flexDirection="row" w="full" justifyContent="space-around" height="100%">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxH="50%"
        >
          <Box
            display="flex"
            flexDirection={notionPageId ? "row" : "column"}
            alignItems={notionPageId ? "baseline" : "center"}
            justifyContent="space-between"
            w="100%"
          >
            <DeployModeSelector
              deployMode={deployMode}
              setDeployMode={setDeployMode}
            />
            <UrlInputArea
              deployMode={deployMode}
              url={url}
              setUrl={setUrl}
              handleFetch={handleFetch}
              isLoading={isLoading}
            />
          </Box>

          {notionPageId && (
            <Box h="100%" w="100%" mx="auto" bg="white">
              {isLoading && <LoadingAnimation />}
              <NotionPageRenderer
                notionPageId={notionPageId}
                deployMode={deployMode}
                onSnapshotReady={handleSnapshotReady}
                selectedBlocks={selectedBlocks}
                handleSelectBlock={handleSelectBlock}
                setSelectedBlocksHtml={setSelectedBlocksHtml}
              />
            </Box>
          )}
        </Box>

        <motion.div
          initial={{ width: "0%", }}
          animate={ isRendered ? {width: "30%"} : {} }
          transition={{ duration: 1 }}
          style={{ transformOrigin: "left", display: isRendered ? "block" : "none" }}
        >
          <Box
            ref={renderSectionRef}
            display="flex"
            flexDirection="column"
          >
            <DomainInputArea
              subdomain={subdomain}
              setSubdomain={setSubdomain}
              handleDeploy={handleDeploy}
            />
            <DeployPreviewRenderer
              deployMode={deployMode}
              selectedBlocksHtml={selectedBlocksHtml}
              style={{ transform: "zoom(0.7)" }}
              width="90%"
            />
          </Box>
        </motion.div>
      </Box>

      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
        <ModalOverlay width={"100%"} height={"100%"} />
        <ModalContent>
          <ModalHeader>
            {modalMessage.includes("https://") ? "배포 완료!" : "배포 중 오류 발생"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalMessage}
            {modalMessage.includes("배포된") && (
              <>
                <Button
                  bg="gray.300"
                  onClick={() => {
                    navigator.clipboard.writeText(modalMessage.split(": ")[1]);
                    setIsCopied(true);
                  }}
                  h={8}
                  w={10}
                  ml={2}
                  p={2.5}
                >
                  <Image src="/copy.svg" alt="Copy Icon" width={96} height={96} />
                </Button>
                <p style={{ color: "green", marginLeft: "10px", minHeight: "24px" }}>
                  {isCopied ? "주소가 복사되었습니다." : ""}
                </p>
              </>
            )}
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
