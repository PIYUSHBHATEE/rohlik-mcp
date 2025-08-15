import { RohlikAPI } from "../rohlik-api.js";

export function createPremiumInfoTool(createRohlikAPI: () => RohlikAPI) {
  return {
    name: "get_premium_info",
    definition: {
      title: "Get Premium Info",
      description: "Get information about your Rohlik Premium subscription",
      inputSchema: {}
    },
    handler: async () => {
      try {
        const api = createRohlikAPI();
        const premiumInfo = await api.getPremiumInfo();

        if (!premiumInfo) {
          return {
            content: [
              {
                type: "text" as const,
                text: "No premium information available."
              }
            ]
          };
        }

        const formatPremiumInfo = (data: any): string => {
          const sections: string[] = [];
          
          // Premium status
          if (data.isActive !== undefined) {
            sections.push(`⭐ PREMIUM STATUS: ${data.isActive ? 'Active' : 'Inactive'}`);
          }

          // Subscription details
          if (data.subscription) {
            const sub = data.subscription;
            sections.push(`📅 SUBSCRIPTION:
   Type: ${sub.type || 'Unknown'}
   Start: ${sub.startDate || 'Unknown'}
   End: ${sub.endDate || 'Unknown'}
   Price: ${sub.price || 'Unknown'} CZK`);
          }

          // Benefits
          if (data.benefits && Array.isArray(data.benefits)) {
            sections.push(`🎁 BENEFITS:
${data.benefits.map((benefit: any) => `   • ${benefit.name || benefit}`).join('\n')}`);
          }

          // Savings
          if (data.totalSavings !== undefined) {
            sections.push(`💰 TOTAL SAVINGS: ${data.totalSavings} CZK`);
          }

          if (data.monthlySavings !== undefined) {
            sections.push(`📊 MONTHLY SAVINGS: ${data.monthlySavings} CZK`);
          }

          // Free delivery info
          if (data.freeDeliveryCount !== undefined) {
            sections.push(`🚚 FREE DELIVERIES USED: ${data.freeDeliveryCount}`);
          }

          // If no structured data, show raw JSON
          if (sections.length === 0) {
            sections.push(`⭐ PREMIUM INFO:\n${JSON.stringify(data, null, 2)}`);
          }

          return sections.join('\n\n');
        };

        const output = formatPremiumInfo(premiumInfo);

        return {
          content: [
            {
              type: "text" as const,
              text: output
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: error instanceof Error ? error.message : String(error)
            }
          ],
          isError: true
        };
      }
    }
  };
}