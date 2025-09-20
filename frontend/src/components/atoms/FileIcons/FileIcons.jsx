import { FaCss3, FaHtml5, FaJs } from "react-icons/fa"
import {GrReactjs} from 'react-icons/gr'

export const FileIcon = ({extension}) =>{

    const IconMapper = {
        'js': <FaJs color='yellow' style = {{height: '10px', width: "10px"}}/>,
        'jsx': <GrReactjs color="blue" style={{height: '25px' , width: '25px'}}/>,
        'css': <FaCss3 color="#3c99dc" style={{height: '25px' , width: '25px'}}/>,
        'html': <FaHtml5 color="#e34c26" style={{height: '10px', width: "10px"}}/>

    }
    return (
        <>
       {IconMapper[extension]}
        </>
    )
}

