from langchain_community.tools import DuckDuckGoSearchRun
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
import json

class LegalSearchEngine:
    def __init__(self):
        self.llm = ChatGroq(model_name="llama-3.1-8b-instant", groq_api_key=settings.GROQ_API_KEY)
        self.web_search = DuckDuckGoSearchRun()

        template = """
        You are an AI legal expert for the Indian legal system.
        Your goal is to provide a professional and detailed response to the user's legal question.

        Use the following web search results as context:
        {context}

        Question: {question}

        Provide a comprehensive legal answer including:
        1. Direct answer to the question
        2. Relevant laws and sections
        3. Practical advice
        4. Important disclaimers
        """
        self.prompt = ChatPromptTemplate.from_template(template)
        self.chain = self.prompt | self.llm

    def search(self, query: str) -> dict:
        try:
            web_results = self.web_search.run(query + " India law")
            response = self.chain.invoke({
                "context": web_results,
                "question": query
            })
            return {
                "answer": response.content,
                "sources": ["DuckDuckGo Web Search"],
                "query": query
            }
        except Exception as e:
            return {
                "answer": f"Error processing query: {str(e)}",
                "sources": [],
                "query": query
            }

    def search_with_context(self, query: str, context: str = "") -> dict:
        try:
            web_results = self.web_search.run(query + " India law")
            full_context = f"{context}\n\nWeb Results: {web_results}" if context else web_results
            response = self.chain.invoke({
                "context": full_context,
                "question": query
            })
            return {
                "answer": response.content,
                "sources": ["DuckDuckGo Web Search"],
                "query": query
            }
        except Exception as e:
            return {
                "answer": f"Error processing query: {str(e)}",
                "sources": [],
                "query": query
            }
