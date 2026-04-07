class RuleEngine {
    /**
     * Evaluates rules against a user context to find the matching rule.
     * @param {Array} rules - Array of approval_workflow_rules
     * @param {Object} user - The user trying to perform the action
     */
    static evaluate(rules, user) {
        for (const rule of rules) {
            if (rule.condition_type === 'ROLE') {
                if (user.role && user.role.role_name === rule.condition_value) {
                    return rule;
                }
            } else if (rule.condition_type === 'ALWAYS') {
                return rule;
            }
            // Can add more condition types here like DEPARTMENT, AMOUNT_GT, etc.
        }

        return null; // No rule match
    }
}

module.exports = RuleEngine;
