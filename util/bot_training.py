#!/usr/bin/env python3
"""
Bot Training and Analysis Script
Helps improve the chat bot by analyzing conversations and suggesting enhancements.
"""

import json
import os
import re
from datetime import datetime
from typing import Dict, List, Tuple, Any
from pathlib import Path
import argparse

class BotTrainer:
    def __init__(self, config_path: str = "../src/config/cipherConfig.ts"):
        self.config_path = Path(config_path)
        self.training_data_path = Path("training_data")
        self.training_data_path.mkdir(exist_ok=True)
        
    def analyze_conversation_logs(self, log_file: str) -> Dict[str, Any]:
        """Analyze conversation logs to identify patterns and improvement areas."""
        analysis = {
            "total_conversations": 0,
            "common_questions": {},
            "response_quality": {},
            "user_satisfaction": {},
            "technical_topics": {},
            "unanswered_questions": [],
            "suggested_improvements": []
        }
        
        if not log_file or not os.path.exists(log_file):
            print(f"Log file {log_file} not found. Creating sample analysis.")
            return self._create_sample_analysis()
            
        # Read and analyze logs
        with open(log_file, 'r') as f:
            logs = json.load(f)
            
        for conversation in logs:
            analysis["total_conversations"] += 1
            
            for message in conversation.get("messages", []):
                if message["role"] == "user":
                    question = message["content"].lower()
                    analysis["common_questions"][question] = analysis["common_questions"].get(question, 0) + 1
                    
                    # Categorize questions
                    if any(word in question for word in ["react", "node", "python", "aws", "docker"]):
                        analysis["technical_topics"]["technology"] = analysis["technical_topics"].get("technology", 0) + 1
                    elif any(word in question for word in ["project", "work", "experience"]):
                        analysis["technical_topics"]["projects"] = analysis["technical_topics"].get("projects", 0) + 1
                    elif any(word in question for word in ["skill", "expertise", "background"]):
                        analysis["technical_topics"]["background"] = analysis["technical_topics"].get("background", 0) + 1
                        
        return analysis
    
    def _create_sample_analysis(self) -> Dict[str, Any]:
        """Create a sample analysis for demonstration."""
        return {
            "total_conversations": 0,
            "common_questions": {
                "what technologies do you use?": 5,
                "tell me about your projects": 3,
                "what's your experience with react?": 2,
                "how do you approach system architecture?": 2
            },
            "response_quality": {
                "technical_accuracy": 0.85,
                "helpfulness": 0.90,
                "clarity": 0.88
            },
            "user_satisfaction": {
                "positive_feedback": 8,
                "neutral_feedback": 2,
                "negative_feedback": 0
            },
            "technical_topics": {
                "technology": 12,
                "projects": 8,
                "background": 5
            },
            "unanswered_questions": [
                "What's your experience with Kubernetes?",
                "How do you handle database scaling?",
                "What's your approach to testing?"
            ],
            "suggested_improvements": [
                "Add more specific examples for technical questions",
                "Include Kubernetes and database scaling in knowledge base",
                "Expand testing methodology responses"
            ]
        }
    
    def generate_training_suggestions(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate suggestions for improving the bot based on analysis."""
        suggestions = []
        
        # Analyze common questions
        top_questions = sorted(analysis["common_questions"].items(), 
                             key=lambda x: x[1], reverse=True)[:5]
        
        suggestions.append("Top questions to address:")
        for question, count in top_questions:
            suggestions.append(f"  - '{question}' (asked {count} times)")
        
        # Suggest knowledge base additions
        if analysis["unanswered_questions"]:
            suggestions.append("\nKnowledge base additions needed:")
            for question in analysis["unanswered_questions"]:
                suggestions.append(f"  - Add response for: {question}")
        
        # Suggest response improvements
        if analysis["response_quality"]["technical_accuracy"] < 0.9:
            suggestions.append("\nResponse quality improvements:")
            suggestions.append("  - Add more technical details to responses")
            suggestions.append("  - Include code examples where appropriate")
        
        return suggestions
    
    def update_knowledge_base(self, new_qa_pairs: List[Dict[str, str]]) -> None:
        """Update the knowledge base with new Q&A pairs."""
        config_content = self.config_path.read_text()
        
        # Find the commonQuestions section
        pattern = r'commonQuestions:\s*\[(.*?)\]'
        match = re.search(pattern, config_content, re.DOTALL)
        
        if match:
            existing_qa = match.group(1)
            new_qa_string = ""
            
            for qa in new_qa_pairs:
                new_qa_string += f"""
            {{
                question: "{qa['question']}",
                response: "{qa['response']}"
            }},"""
            
            # Update the config file
            updated_content = config_content.replace(
                f'commonQuestions: [{existing_qa}]',
                f'commonQuestions: [{existing_qa}{new_qa_string}]'
            )
            
            self.config_path.write_text(updated_content)
            print(f"Updated knowledge base with {len(new_qa_pairs)} new Q&A pairs")
    
    def create_training_report(self, analysis: Dict[str, Any]) -> str:
        """Create a comprehensive training report."""
        report = f"""
# Bot Training Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Overview
- Total conversations analyzed: {analysis['total_conversations']}
- Response quality score: {analysis['response_quality'].get('technical_accuracy', 0):.2f}

## Most Common Questions
"""
        
        for question, count in sorted(analysis["common_questions"].items(), 
                                    key=lambda x: x[1], reverse=True)[:10]:
            report += f"- {question}: {count} times\n"
        
        report += f"""
## Technical Topics Distribution
"""
        for topic, count in analysis["technical_topics"].items():
            report += f"- {topic}: {count} mentions\n"
        
        report += f"""
## Suggested Improvements
"""
        for suggestion in analysis["suggested_improvements"]:
            report += f"- {suggestion}\n"
        
        return report
    
    def run_training_session(self, log_file: str = None) -> None:
        """Run a complete training session."""
        print("🤖 Starting Bot Training Session...")
        
        # Analyze existing conversations
        analysis = self.analyze_conversation_logs(log_file)
        
        # Generate suggestions
        suggestions = self.generate_training_suggestions(analysis)
        
        # Create report
        report = self.create_training_report(analysis)
        
        # Save report
        report_path = self.training_data_path / f"training_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        report_path.write_text(report)
        
        print(f"📊 Analysis complete! Report saved to: {report_path}")
        print("\n🔍 Key Findings:")
        for suggestion in suggestions:
            print(suggestion)
        
        print(f"\n💡 Next Steps:")
        print("1. Review the training report")
        print("2. Update knowledge base with new Q&A pairs")
        print("3. Test the bot with new scenarios")
        print("4. Collect more conversation data for future training")

def main():
    parser = argparse.ArgumentParser(description="Bot Training and Analysis Tool")
    parser.add_argument("--log-file", help="Path to conversation log file")
    parser.add_argument("--config", default="../src/config/cipherConfig.ts", 
                       help="Path to cipherConfig.ts file")
    parser.add_argument("--add-qa", nargs=2, metavar=('QUESTION', 'ANSWER'),
                       help="Add a new Q&A pair to the knowledge base")
    
    args = parser.parse_args()
    
    trainer = BotTrainer(args.config)
    
    if args.add_qa:
        question, answer = args.add_qa
        trainer.update_knowledge_base([{"question": question, "answer": answer}])
    else:
        trainer.run_training_session(args.log_file)

if __name__ == "__main__":
    main() 