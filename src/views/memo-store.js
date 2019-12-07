import React, { useEffect } from 'react'
import { useFirebase } from 'react-redux-firebase'

const MemoStore = () => {
  const firebase = useFirebase()
  const storageRef = firebase.storage().ref('')

  useEffect(() => {
    (async () => {
      try {
        const result = await storageRef.listAll()
        result.prefixes.forEach(async (folder) => {
          console.log(folder)
          const folderRef = storageRef.child(folder.location.path)
          const subFiles = await folderRef.listAll()
          //const meta = await folderRef.getMetadata() // => uniquement pour les fichiers !
          console.log(subFiles.items, subFiles.prefixes.map(f => f.location.path).join(','))
        })
        console.log(result.items)
      } catch(e) {
        console.log(e)
      }
    })()
  }, [storageRef])

  return (
    <div>list of games</div>
  )
}

export default MemoStore