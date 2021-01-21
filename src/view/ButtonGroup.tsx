import React, { useState } from "react";
import { CSSProperties } from "react";
import { useTheme, useWindowScale } from "./hooks";
import { themeContext, TTheme } from "./themes";

function useStyle(): Record<string, CSSProperties> {
    const sc = useWindowScale()
    const th = useTheme()
    return {
        root: {
            padding: 3,
            backgroundColor: 'rgb(239, 242, 245)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
            position: 'relative',
            width: 65,
            height: 40,
            WebkitBoxAlign: '-moz-initial'
        },
        font: {
            fontSize: 12,
            fontWeight: 600,
            color: 'ButtonText',
            lineHeight: 1.5,
            margin: 0
        },
        slider: {
            width: 59,
            height: 34,
            left: 3,
            top: 3
        },
        button: {
            paddingTop: 8,
            paddingRight: 16,
            paddingBottom: 8,
            paddingLeft: 16,
            borderRadius: 6,
            height: 'auto',
            transitionProperty: 'all',
            transitionDuration: '0.1s',
            transitionTimingFunction: 'ease',
            transitionDelay: '0',
            zIndex: 2
        }
    }
}

function ButtonGroup() {
    const [theme, setTheme] = useState<TTheme>('dark')
    const sty = useStyle()
    const choices = ['light', 'dark']
    return (
        <themeContext.Provider value={{
            cur: 'dark',
            updateTheme: (theme) => setTheme(theme)
        }}>
            <div style={sty.root}>
                <div className="slider" style={sty.slider} />

                {choices.map(x =>
                    <button style={sty.button}>
                        <p style={sty.font}>{x}</p>
                    </button>
                )}
            </div>
        </themeContext.Provider>
    )
}

export const group = <ButtonGroup />