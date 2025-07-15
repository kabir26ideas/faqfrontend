import ChatContainer from "@/components/ChatContainer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <ChatContainer className="w-full h-[600px]" />
      </div>
    </div>
  );
};

export default Index;