"use client";

import { type ReactNode } from "react";
import { ViewTransition } from "react";

/**
 * ViewTransition 安全封装。
 *
 * React 的 <ViewTransition> 在「过渡尚未完成时再次导航/页面被中止」时，
 * 浏览器会中止 View Transition 并让 promise 以 InvalidStateError 拒绝；
 * 该拒绝未在 React 内部被捕获，会以 unhandledrejection 打到控制台
 * （"Transition was aborted because of invalid state"）。
 *
 * 过滤器在模块加载（hydration 之前）即注册，保证 ViewTransition 挂载
 * 首帧可能出现的 rejection 也被覆盖；仅过滤 View Transition 中止的
 * InvalidStateError，其他未处理拒绝照常暴露。
 */

const ABORTED_TRANSITION_RE = /Transition was aborted/;

function onUnhandledRejection(e: PromiseRejectionEvent) {
  const err = e.reason;
  const isAbortedTransition =
    err instanceof DOMException &&
    err.name === "InvalidStateError" &&
    ABORTED_TRANSITION_RE.test(String(err.message));
  if (isAbortedTransition) {
    e.preventDefault();
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", onUnhandledRejection);
}

export function SafeViewTransition({ children }: { children: ReactNode }) {
  return <ViewTransition name="page">{children}</ViewTransition>;
}
