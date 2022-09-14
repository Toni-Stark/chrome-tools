import { initSentry } from "./sentry"
import { getExtensionCommands, getExtensionInformation } from "./helpers"
import Synthesizer from "./synthesizer"
console.log(5555555)
initSentry(await getExtensionInformation())

const commands = await getExtensionCommands()
const startCommand = commands.find(element => element.name === "speak")
const downloadCommand = commands.find(element => element.name === "download")

chrome.contextMenus.create({
  id: 'start',
  title: `Start Speaking${startCommand.shortcut ? ` (${startCommand.shortcut})` : ""}`,
  contexts: ['selection'],
  onclick: info => Synthesizer.start(info.selectionText)
})

chrome.contextMenus.create({
  id: 'stop',
  title: 'Stop Speaking',
  contexts: ['selection'],
  onclick: _ => Synthesizer.stop(),
  enabled: false
})

chrome.contextMenus.create({
  id: 'download',
  title: `Download as MP3 ${downloadCommand.shortcut ? ` (${downloadCommand.shortcut})` : ""}`,
  contexts: ['selection'],
  onclick: info => Synthesizer.download(info.selectionText)
})

chrome.commands.onCommand.addListener(command => {
  switch (command) {
    case "speak":
      chrome.tabs.executeScript(
        { code: convertSelection },
        selection => Synthesizer.start(selection[0])
      )
      break
    case "download":
      chrome.tabs.executeScript(
        { code: convertSelection },
        selection => Synthesizer.download(selection[0])
      )
      break
  }
})

// Get the selected text and adds imgs alt tags into text
const convertSelection = `
function retrieveSelection() {
  const selectionContents = window.getSelection()?.getRangeAt(0).cloneContents()
  const imgs = selectionContents.querySelectorAll('img')
  for (const img of imgs) {
    const altText = document.createTextNode(img.alt)
    img.parentNode.replaceChild(altText, img)
  }

  return selectionContents.textContent
}

retrieveSelection()
`
