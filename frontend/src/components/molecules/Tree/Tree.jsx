    import { noop } from '@tanstack/react-query';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { FileIcon } from '../../atoms/FileIcons/FileIcons';
import { useEditorSocketStore } from '../../../store/editorSocketStore';

export const Tree = ({
    fileFolderData
}) =>{

    const [visiblity , setVisiblity]  =useState({})

    const {editorSocket} = useEditorSocketStore()


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
                paddingTop: '15px',
                fontSize: '16px',
                
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
                paddingTop: '5px',
                fontSize: '15px',
                cursor: 'pointer',
                color: 'white',
                marginLeft: '5px',
            }}

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