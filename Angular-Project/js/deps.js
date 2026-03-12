// Bridge the global CDN builds (Vue, VueRouter) into ES module exports.
// Global script tags in index.html load Vue and VueRouter synchronously,
// so by the time this deferred module runs those globals are already set.
/* global Vue, VueRouter */

const {
  createApp, defineComponent, ref, reactive, computed,
  inject, provide, onMounted, watch
} = Vue;

const { createRouter, createWebHashHistory, useRoute, useRouter } = VueRouter;

export {
  createApp, defineComponent, ref, reactive, computed,
  inject, provide, onMounted, watch,
  createRouter, createWebHashHistory, useRoute, useRouter
};
