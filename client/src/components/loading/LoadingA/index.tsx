import { LoadingAEmits, LoadingAProps } from './type'
import {memo} from "react";

export const LoadingA = memo(
  (props:LoadingAProps,context:LoadingAEmits) => {
    return <>
        {props.open && (
            <div className="loading">
                <div className="loadingspinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            </div>
        )}
    </>
  }
)
