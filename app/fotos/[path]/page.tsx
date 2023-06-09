import { useRouter } from "next/router"




const page = () => {
   const router=useRouter()
   const path=router.query.path
   console.log(path)
  return (
    <div>page</div>
  )
}

export default page