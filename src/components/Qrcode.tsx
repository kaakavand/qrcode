"use client";
import React from "react";
import { Button, QRCode, Segmented, Space, Input, Upload } from "antd";
import type { QRCodeProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function doDownload(url: string, fileName: string) {
  const a = document.createElement("a");
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const downloadCanvasQRCode = () => {
  const canvas = document
    .getElementById("myqrcode")
    ?.querySelector<HTMLCanvasElement>("canvas");
  if (canvas) {
    const url = canvas.toDataURL();
    doDownload(url, "QRCode.png");
  }
};

const downloadSvgQRCode = () => {
  const svg = document
    .getElementById("myqrcode")
    ?.querySelector<SVGElement>("svg");
  const svgData = new XMLSerializer().serializeToString(svg!);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  doDownload(url, "QRCode.svg");
};

const Qrcode: React.FC = () => {
  const [renderType, setRenderType] =
    React.useState<QRCodeProps["type"]>("canvas");
  const [link, setLink] = React.useState<string>("");
  const [icon, setIcon] = React.useState<string | undefined>(undefined);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleIconUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setIcon(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
  };

  return (
    <div
      style={{
        maxWidth: "100%",
        padding: "16px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <Space
        id="myqrcode"
        direction="vertical"
        size="large"
        style={{ width: "100%" }}
      >
        <Segmented
          options={["canvas", "svg"]}
          value={renderType}
          onChange={setRenderType}
          style={{ width: "100%" }}
        />
        <Input
          placeholder="Enter the URL for the QR Code"
          value={link}
          onChange={handleLinkChange}
          style={{ width: "100%" }}
        />
        <Upload
          beforeUpload={handleIconUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
            Upload Logo
          </Button>
        </Upload>
        <QRCode
          type={renderType}
          value={link}
          bgColor="#fff"
          style={{ marginBottom: 16, maxWidth: "100%" }}
          icon={icon}
        />
        <Button
          type="primary"
          onClick={
            renderType === "canvas" ? downloadCanvasQRCode : downloadSvgQRCode
          }
          style={{ width: "100%" }}
        >
          Download
        </Button>
      </Space>
    </div>
  );
};

export default Qrcode;
