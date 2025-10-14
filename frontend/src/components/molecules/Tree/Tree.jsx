    import { noop } from '@tanstack/react-query';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { FileIcon } from '../../atoms/FileIcons/FileIcons';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';

export const Tree = ({
    fileFolderData
}) =>{

    const [visiblity , setVisiblity]  =useState({})

    const {editorSocket} = useEditorSocketStore()

    const {
       setFile,
       setIsOpen: setFileContextMenuIsOpen,
       setX: setFileContextMenuX,
       setY: setFileContextMenuY } = useFileContextMenuStore()
    function toggleVisiblity(name) {
        setVisiblity({
            ...visiblity,
            [name]: !visiblity[name]
        })
    }

    function computeExtension(fileFolderData){
        const names = fileFolderData.name.split('.')
        return names[names.length -1 ]
    }
    function handleDoubleClick(fileFolderData){
        console.log('Double clicked on' , fileFolderData)
        editorSocket.emit('readFile',{
            pathToFileOrFolder: fileFolderData.path
        })
    }
    function handleContextMenuForFiles(e,path){
        e.preventDefault()
        console.log('Right Clicked on',path)
        setFile(path)
        setFileContextMenuX(e.clientX)
        setFileContextMenuY(e.clientY)
        setFileContextMenuIsOpen(true)
    }
    
return(
    (fileFolderData &&  
    <div
    style={{
        paddingLeft: '15px',
        color: 'white'
    }}
    >
        {fileFolderData.children ? (
            <button

            onClick={() => toggleVisiblity(fileFolderData.name)}
            style={{
                border: 'none',
                cursor: 'pointer',
                outline: "none",
                color: 'white',
                backgroundColor: '#333254',
                padding: '15px',
                fontSize: '16px',
                marginTop: '10px'
                
            }}
            >
                {visiblity[fileFolderData.name] ? <IoIosArrowDown/>: <IoIosArrowForward/>}
                {fileFolderData.name}

            </button>
        ): (
            <div style={{display: 'flex', alignItems: 'center'}}>
                <FileIcon extension= {computeExtension(fileFolderData )}/>
            <p
            style={{
                padding: '5px',
                fontSize: '15px',
                cursor: 'pointer',
                color: 'white',
                marginLeft: '5px',
                marginTop: '10px'
            }}
            onContextMenu={(e)=>handleContextMenuForFiles(e,fileFolderData.path)}
            onDoubleClick={()=> handleDoubleClick(fileFolderData)}
            
            >
            {fileFolderData.name}

            </p>
            </div>
        )}

        {visiblity[fileFolderData.name] && fileFolderData.children && (
            fileFolderData.children.map((child) =>(
                <Tree
                fileFolderData={child}
                key={child.name}
                />
            ))
        )}

    </div>)
)

}