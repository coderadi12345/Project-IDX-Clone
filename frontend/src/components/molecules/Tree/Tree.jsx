    import { noop } from '@tanstack/react-query';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { FileIcon } from '../../atoms/FileIcons/FileIcons';

export const Tree = ({
    fileFolderData
}) =>{

    const [visiblity , setVisiblity]  =useState({})

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
                backgroundColor: 'black',
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
                color: 'black',
                marginLeft: '5px',
            }}
            
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