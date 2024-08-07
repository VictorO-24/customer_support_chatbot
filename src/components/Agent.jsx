
const Agent = ({message})=>{
    return(
        <div className="flex items-start gap-4">
          <div className="rounded-lg w-10 h-10 bg-[#55efc4] text-3xl flex items-center justify-center">🤖</div>
            <div className="grid gap-1 items-start text-sm">
              <div className="flex items-center gap-2">
                <div className="font-bold">Assistant</div>
                <div className="text-sm text-muted-foreground">2:39pm</div>
              </div>
              <div>
                <p>{message}</p>
              </div>
            </div>
        </div>
    )
}

export default Agent;