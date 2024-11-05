import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("Home Component", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe("handleFetch", () => {
    it("API 호출 후 snapshotHtml 상태가 성공적으로 업데이트 되는지 확인", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ snapshotHtml: "<div>Mocked HTML</div>" }),
      );

      render(<Home />);
      const notionUrlInput =
        screen.getByPlaceholderText("노션 url을 입력해주세요");
      const fetchButton = screen.getByText("데이터 가져오기");

      fireEvent.change(notionUrlInput, {
        target: { value: "https://notion.so/test-url" },
      });
      fireEvent.click(fetchButton);

      await waitFor(() =>
        expect(screen.getByText("Mocked HTML")).toBeInTheDocument(),
      );
    });

    it("API 요청 실패 시 UI가 업데이트가 되지 않는지 확인", async () => {
      fetch.mockReject(new Error("API 요청 실패"));

      render(<Home />);
      const notionUrlInput =
        screen.getByPlaceholderText("노션 url을 입력해주세요");
      const fetchButton = screen.getByText("데이터 가져오기");

      fireEvent.change(notionUrlInput, {
        target: { value: "https://notion.so/test-url" },
      });
      fireEvent.click(fetchButton);

      await waitFor(() => {
        expect(
          screen.queryByText("데이터 가져오기 중..."),
        ).not.toBeInTheDocument();
      });

      expect(screen.queryByText("Mocked HTML")).not.toBeInTheDocument();
    });
  });

  describe("handleDeploy", () => {
    it("배포 API 호출 후 성공 모달이 표시되는지 확인", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ url: "https://deployed-site.com" }),
      );

      render(<Home />);
      const subdomainInput = screen.getByPlaceholderText("배포 URL 입력");
      const deployButton = screen.getByText("배포");

      fireEvent.change(subdomainInput, { target: { value: "my-subdomain" } });
      fireEvent.click(deployButton);

      await waitFor(() =>
        expect(
          screen.getByText("배포된 사이트: https://deployed-site.com"),
        ).toBeInTheDocument(),
      );
    });

    it("중복되는 서브도메인 사용으로 배포 API 실패 시 에러 메시지가 표시되는지 확인", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ error: "동일한 도메인이 이미 존재합니다" }),
        { status: 400 },
      );

      render(<Home />);
      const subdomainInput = screen.getByPlaceholderText("배포 URL 입력");
      const deployButton = screen.getByText("배포");

      fireEvent.change(subdomainInput, {
        target: { value: "duplicate-subdomain" },
      });
      fireEvent.click(deployButton);

      await waitFor(() =>
        expect(
          screen.getByText("동일한 도메인이 이미 존재합니다"),
        ).toBeInTheDocument(),
      );
    });
  });
});
