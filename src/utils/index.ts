const handleFileChosen = async (file: File) => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(file)
    reader.onerror = reject
  })
}
const readAllFiles = async (files: File[]) => {
  const results = (await Promise.all(
    files.map(async (file) => {
      const fileContents = await handleFileChosen(file)
      return fileContents
    })
  )) as string[]
  return results
}

export { handleFileChosen, readAllFiles }
