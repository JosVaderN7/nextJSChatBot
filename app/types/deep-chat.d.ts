declare module 'deep-chat-react' {
  export interface DeepChatProps {
    connect?: {
      url: string;
      method: string;
      headers: Record<string, string>;
      additionalBodyProps?: Record<string, any>;
    };
    history?: Array<{
      role: string;
      text?: string;
      content?: string;
    }>;
    style?: Record<string, string>;
    textInput?: {
      placeholder?: {
        text: string;
      };
    };
    introMessage?: {
      text: string;
    };
    [key: string]: any;
  }

  export class DeepChat extends React.Component<DeepChatProps> {}
} 