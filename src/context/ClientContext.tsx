import React, { createContext, useState, useEffect, useContext } from 'react'
import { Client } from 'userop'
import { CommonContext } from './CommonContext'

export const ClientContext = createContext<Client | null>(null)

export interface ProviderProps {
  children: React.ReactNode
}

export const ClientProvider: React.FC<ProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null)
    const config = useContext(CommonContext);

  const rpcUrl = config?.neroConfig.rpcUrl
  const bundlerUrl = config?.neroConfig?.bundlerUrl
  const entryPoint = config?.neroConfig?.entryPoint
  const paymasterRpcUrl = config?.neroConfig.paymasterRpc

  useEffect(() => {
    const initClient = async () => {
      if (!rpcUrl || !bundlerUrl || !entryPoint || !paymasterRpcUrl) {
        console.error('Client.init skipped: One or more crucial config values are missing.', 
          { rpcUrl, bundlerUrl, entryPoint, paymasterRpcUrl });
        return;
      }
      try {

        const initializedClient = await Client.init(rpcUrl, {
          entryPoint,
          overrideBundlerRpc: bundlerUrl,
        })
        setClient(initializedClient)
        console.log('Userop Client initialized successfully.')
      } catch (error) {
        console.error('Failed to initialize userop client:', error)
      }
    }
    if (config?.neroConfig && rpcUrl && bundlerUrl && entryPoint && paymasterRpcUrl) {
      initClient()
    } else if (config?.neroConfig) {
      console.warn('Client initialization skipped: Missing required config values from ConfigContext.', 
        { rpcUrl, bundlerUrl, entryPoint, paymasterRpcUrl });
    } else {
      console.warn('Client initialization skipped: ConfigContext is not yet available.');
    }

  }, [config?.neroConfig, rpcUrl, bundlerUrl, entryPoint, paymasterRpcUrl])

  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
}