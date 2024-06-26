import { useModal } from "@/hooks/useModal";
import "@/components/modal/modal.scss"
import Button from "../button/button";
import parse from 'html-react-parser';

const Modal = () => {
  const { modalDataState, closeModal } = useModal();
  const { title, content, button, callBack, isOpen, emoticon } = modalDataState;

  return (
    <>
      { isOpen && (
        <div className="modal-container">
          <button className="modal-close-button" onClick={closeModal}>닫기</button>
          { (title || emoticon) && (
            <div className="modal-title">
              {title && <h1>{title}</h1>}
              {emoticon && 
                <div>{typeof emoticon === 'string' ? parse(emoticon) : emoticon}</div>
              }
            </div>
          )}
          <div className="modal-content">
            <div>{typeof content === 'string' ? parse(content) : content}</div>
          </div>
          {
            button && (
              <div className="modal-footer">
                <Button handleClick={callBack} size="normal" color="secondary">{button}</Button>
              </div>
            )
          }
        </div>
      )}
    </>
  )
}

export default Modal;