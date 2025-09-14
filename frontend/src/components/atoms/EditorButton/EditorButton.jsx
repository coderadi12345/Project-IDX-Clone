import './EditorButton.css'


export const EditorButton = ({isActive}) =>{

    return (

        <button className="editor-button"
        style={{
            color: isActive ? 'white' : '#959eba',
            backgroundColor: isActive ? '#303242' : '#4a4859',
            borderTop: isActive ? '1px solid #f7b9dd' : 'none',
              }}
              >
            file.js
        </button>
    )
}