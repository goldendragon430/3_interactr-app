import { ApolloProvider } from "@apollo/client";
import React, { useEffect } from "react";
import styles from "./App.module.scss";
import RootPage from "./RootPage";
// Add icons library
import "./utils/iconsLibrary";
// Add styles
import "react-dropzone-uploader/dist/styles.css";
// Add styles.scss after all vendor styling as it includes some overwrites for those
import client from "./graphql/client";
import "./sass/styles.scss";
import { fonts } from './utils/fonts';
import WebFont from 'webfontloader';

export default function App() {
  // Loading fonts here
  useEffect(() => {
    WebFont.load({
      google: {
        families: fonts
      }
    });
  }, []);
  return (
    <ApolloProvider client={client}>
      <div className={styles.App}>
        <RootPage />
        <div id="portal-container">&nbsp;</div>
      </div>
    </ApolloProvider>
  );
}
