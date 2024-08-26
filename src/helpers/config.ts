import { diskStorage } from "multer";

export const storageconfig = (folder: string)=>diskStorage({
    destination: `upload/${folder}`,
    filename: (req, file, cb) =>{
        cb(null, Date.now()+'-'+file.originalname)
    }
})
