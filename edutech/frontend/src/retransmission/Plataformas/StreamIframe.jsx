import React from "react";

const StreamIframe = ({
  src,
  height,
  width,
  frameBorder,
  title,
  allowFullScreen = false,
}) => {
  return (
    <iframe
      src={src}
      height={height}
      width={width}
      allowFullScreen={allowFullScreen}
      title={title}
      frameBorder={frameBorder}
    />
  );
};

export default StreamIframe;
