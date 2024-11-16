import { createContext } from "react";
import { useContext, useState } from "react";


const CodeContext = createContext<ICodeContextType|undefined>(undefined);

export const CodeContextProvider = ({ children }: { children: any }) => {
    const [code, setCode] = useState<string>('');
    const [freeze, setFreeze] = useState<number[]>([60000,180000,300000]);
    const [attempt, setAttempt] = useState(0);
    const [disable, setDisable] = useState(false);


    const value = {
        code:code,
        freeze:freeze,
        attempt: attempt,
        disabled: disable,
        onChangeCode: setCode,
        onChangeFreeze: setFreeze,
        onChangeAttempt: setAttempt,
        onChangeDisabled: setDisable,
    };
  
    return <CodeContext.Provider value={value}>{children}</CodeContext.Provider>;
  };
  
export const useCodeContext = () => {
    const context = useContext(CodeContext);
    if (!context) {
      throw new Error('useCodeContext must be used within an Provider');
    }
    return context;
};
