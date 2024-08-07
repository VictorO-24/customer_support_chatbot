
const User = ({message})=>{
    return(
        <div className="flex items-start gap-4 justify-end">
          <div className="grid gap-1 items-start text-sm">
            <div className="flex items-center gap-2">
              <div className="font-bold">You</div>
              <div className="text-sm text-muted-foreground">2:40pm</div>
            </div>
            <div>
              <p>{message}</p>
            </div>
          </div>
          <div
            className="rounded-lg w-10 h-10 bg-[#ffeaa7] text-3xl flex items-center justify-center">😀</div>
        </div>
    )
}

export default User;