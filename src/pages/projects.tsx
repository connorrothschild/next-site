import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import ProjectsScroll from "@/components/Sections/Projects/ProjectsScroll";
import React from "react";

export default function projects() {
  return (
    <PageTransitionWrapper>
      <ProjectsScroll />
    </PageTransitionWrapper>
  );
}
