interface ChromeExtensionDetails extends chrome.runtime.Manifest {
  id: MessageSender
}

declare namespace chrome.app {
  export function getDetails(): ChromeExtensionDetails
}
