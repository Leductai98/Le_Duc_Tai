import React from "react";
import { memo } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
export default memo(function Loading() {
  return (
    <div className="loading">
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 40, color: "#000" }} spin />
        }
      />
    </div>
  );
});
