import React from "react";
import BreadcrumbBar from 'components/BreadcrumbBar';

export default function NewProjectNav(){
  return (
    <BreadcrumbBar
      back="/projects"
      left={<h1>Select A Template</h1>}
      />
  )
}
