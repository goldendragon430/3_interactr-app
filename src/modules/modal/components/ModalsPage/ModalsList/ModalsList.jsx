import React, { useState, useEffect } from "react";
import PropTypes, { object } from "prop-types";
import _map from "lodash/map";
import { motion } from "framer-motion";

import { ModalsListItem } from "./ModalsListItem";

import styles from "../ModalsPage.module.scss";

export const ModalsList = ({ modals, loading, stats }) => {
  const item = {
    hidden: { opacity: 0, x: 100, scale: 1 },
    show: { opacity: 1, x: 0, scale: 1, transition: { type: "ease-in" } },
  };

  const list = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={list}
      style={{ marginLeft: "30px", paddingBottom: "15px" }}
    >
      {modals.length
        ? _map(modals, (modal) => (
            <motion.div
              key={modal.id}
              variants={item}
              className={styles.wrapper}
            >
              <ModalsListItem modal={modal} loading={loading} stats={stats} />
            </motion.div>
          ))
        : "No popups."}
    </motion.div>
  );
};

ModalsList.propTypes = {
  modals: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleCopy: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  stats: PropTypes.bool.isRequired,
};
