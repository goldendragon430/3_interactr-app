import React from 'react';
import styles from './App.module.scss';
import { BrowserRouter, Routes } from 'react-router-dom';
import {ApolloProvider} from "@apollo/client";
import RootPage from './RootPage';
// Add icons library
import './utils/iconsLibrary';
// Add styles
import 'react-dropzone-uploader/dist/styles.css';
// Add styles.scss after all vendor styling as it includes some overwrites for those
import './sass/styles.scss';
import client from './graphql/client';
import ElementProperties from "./modules/element/components/Properties/ElementProperties";



export default function App() {
  return (
    <ApolloProvider client={client}>
        <div className={styles.App}>
          <RootPage />
          <div id="portal-container">&nbsp;</div>
        </div>
    </ApolloProvider>
  );
}
