import React, { useEffect, useState } from "react";
import { GET_BUNNY_CDN_VIDEO } from "../../../graphql/Media/queries";
import { useQuery } from "@apollo/client";
import ContentLoader from "react-content-loader";
import Label from "../../../components/Label";
import apis from "../../../utils/apis";
import { cache } from "../../../graphql/client";

const MediaEncodingUpdater = ({ media }) => {
  const { loading, error, data } = useQuery(GET_BUNNY_CDN_VIDEO, {
    variables: {
      media_id: media.id,
    },
  });

  if (loading) return <LoadingLabel />;

  if (error) return <Error error={error} />;

  if (!data.result) return <Error error={"No result for bunny cdn video"} />;

  const { status } = data.result;

  if (status === 5 || data.status === 6) return <Error />;

  return <ShowLabelAndPollForUpdates item={data.result} />;
};

export default MediaEncodingUpdater;

const LoadingLabel = () => {
  return (
    <div style={{ paddingTop: 3 }}>
      <ContentLoader
        speed={2}
        width={110}
        height={16}
        viewBox="0 0 110 16"
        foregroundColor={"#fff"}
        backgroundColor={"#f3f6fd"}
      >
        {/* Only SVG shapes */}
        <rect x="0" y="0" rx="10" ry="10" width="110" height="16" />
      </ContentLoader>
    </div>
  );
};

const Error = ({ error = null }) => {
  // TODO need to implement retry functionality MagicPalm
  const handleRetry = () => {
    console.log("TIGER handleRetry");
  };

  useEffect(() => {
    console.error(error);
  }, []);

  return (
    <Label
      onClick={handleRetry}
      danger
      style={{ marginTop: 2, cursor: "pointer" }}
      small
    >
      Error! Click to Retry
    </Label>
  );
};

const ShowLabelAndPollForUpdates = ({ item }) => {
  // _ the setter here so it doesn't override the window.setInterval method
  const [timeout, _setTimout] = useState(null);

  const [error, setError] = useState(false);

  useEffect(() => {
    const getUpdate = async () => {
      try {
        const response = await apis.phpApi("bunnycdn/poll/" + item.id, {
          method: "post",
        });

        const json = await response.json();

        cache.modify({
          id: cache.identify({ id: json.id, __typename: "BunnyCdnVideo" }),
          fields: {
            status: () => json.status,
          },
        });

        if (json.status === 4) {
          cache.modify({
            id: cache.identify({ id: json.media_id, __typename: "Media" }),
            fields: {
              temp_storage_url: () => json.media.temp_storage_url,
              manifest_url: () => json.media.manifest_url,
            },
          });
        } else {
          // Call the func again in 30secs until we get a status of 4
          _setTimout(setTimeout(getUpdate, 30000));
        }
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };

    getUpdate();

    return () => clearTimeout(timeout);
  }, []);

  if (error) return <Error error={error} />;

  const { status } = item;

  if (status === 0)
    return (
      <Label flash primary style={{ marginTop: 2 }} small>
        Created...
      </Label>
    );

  if (status === 1)
    return (
      <Label flash secondary style={{ marginTop: 2 }} small>
        Uploading...
      </Label>
    );

  if (status === 2)
    return (
      <Label flash purple style={{ marginTop: 2 }} small>
        Queued...
      </Label>
    );

  if (status === 3)
    return (
      <Label flash purple style={{ marginTop: 2 }} small>
        Transcoding...
      </Label>
    );

  if (status === 4)
    return (
      <Label primary style={{ marginTop: 2 }}>
        Completed!
      </Label>
    );

  return <Error error={"Unknown bunny cdn status"} />;
};
