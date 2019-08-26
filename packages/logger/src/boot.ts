import { BrowserLoggerFactory } from "./browser";
import { LoggerFactory } from "./core";

// setup default logger factory
// TODO: initialize in a bundle
LoggerFactory.factory = new BrowserLoggerFactory();
