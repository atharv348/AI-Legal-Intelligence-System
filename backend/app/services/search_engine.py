from langchain_community.tools import DuckDuckGoSearchRun
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
import json

class LegalSearchEngine:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        if self.api_key:
            self.llm = ChatGroq(model_name="llama-3.1-8b-instant", groq_api_key=self.api_key)
        else:
            self.llm = None
            
        self.web_search = DuckDuckGoSearchRun()

        template = """
        You are a friendly, knowledgeable legal assistant. Answer the user's question clearly and conversationally, like a trusted friend.

        RULES:
        - Open directly with the answer.
        - Use plain language and explain any legal terms.
        - No robotic headers or labels.
        - Naturally weave in any case examples or next steps.

        Use the following web search results as context:
        {context}

        Question: {question}

        Respond as Nyaya AI:
        """
        self.prompt = ChatPromptTemplate.from_template(template)
        self.chain = self.prompt | self.llm

    def search(self, query: str, top_k: int = 5, **kwargs) -> dict:
        if not self.llm:
            return {
                "answer": "Legal Intelligence is currently in 'Search-Only' mode because the GROQ_API_KEY is missing. Please add it to the environment variables to enable AI-powered summaries.",
                "sources": [{"id": "web-1", "title": "DuckDuckGo Web Search", "content": "AI Summary disabled due to missing API key."}],
                "query": query
            }
        try:
            web_results = self.web_search.run(query + " India law")
            # DuckDuckGo tool doesn't support top_k directly in run(), 
            # but we accept it to maintain compatibility with other services.
            response = self.chain.invoke({
                "context": web_results,
                "question": query
            })
            return {
                "answer": response.content,
                "sources": [{"id": "web-1", "title": "DuckDuckGo Web Search", "content": web_results}],
                "query": query
            }
        except Exception as e:
            return {
                "answer": f"Error processing query: {str(e)}",
                "sources": [],
                "query": query
            }

    def search_with_context(self, query: str, context: str = "") -> dict:
        if not self.llm:
            return {
                "answer": "Legal Intelligence is currently in 'Search-Only' mode because the GROQ_API_KEY is missing.",
                "sources": [{"id": "web-1", "title": "DuckDuckGo Web Search", "content": "AI Summary disabled."}],
                "query": query
            }
        try:
            web_results = self.web_search.run(query + " India law")
            full_context = f"{context}\n\nWeb Results: {web_results}" if context else web_results
            response = self.chain.invoke({
                "context": full_context,
                "question": query
            })
            return {
                "answer": response.content,
                "sources": [{"id": "web-1", "title": "DuckDuckGo Web Search", "content": web_results}],
                "query": query
            }
        except Exception as e:
            return {
                "answer": f"Error processing query: {str(e)}",
                "sources": [],
                "query": query
            }
