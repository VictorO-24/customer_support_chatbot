import Image from "next/image";
const User = ({message, name, image})=>{
    return(
        <div className="flex items-start gap-4 justify-end">
          <div className="grid gap-1 items-start text-sm">
            <div className="flex items-center gap-2">
              <div className="font-bold">{name}</div>
            </div>
            <div className="max-w-md">
              <p>{message}</p>
            </div>
          </div>
          <div className=" rounded-full w-10 h-10 flex items-center justify-center">
            <Image className="rounded-full" src={image} width={100} height={100} alt="user pic" />
          </div>
        </div>
    )
}

export default User;