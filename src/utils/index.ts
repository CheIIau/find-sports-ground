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

const formatDate = (timestamp: number) => {
  const a = new Date(timestamp)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes() < 10 ? `0${a.getMinutes()}` : `${a.getMinutes()}`
  const time = `${date} ${month} ${year} ${hour}:${min}`
  return time
}
export { handleFileChosen, readAllFiles, formatDate }
