import { createTRPCReact } from "@trpc/react-query";
import type { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppRouter } from "../../server/router";
import type { ReactNode } from "react";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient();

// Helper functions for mock storage
const getStorageItem = (key: string, defaultVal: any) => {
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(val);
  } catch {
    return defaultVal;
  }
};

const setStorageItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Default seed datasets
const defaultPOs = [
  { id: 1, poNumber: "PO1", description: "Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.", attainmentPercent: "75.00", departmentId: 1 },
  { id: 2, poNumber: "PO2", description: "Problem analysis: Identify, formulate, research literature, and analyze complex engineering problems reaching substantiated conclusions.", attainmentPercent: "68.00", departmentId: 1 },
  { id: 3, poNumber: "PO3", description: "Design/development of solutions: Design solutions for complex engineering problems and design system components or processes.", attainmentPercent: "82.00", departmentId: 1 },
  { id: 4, poNumber: "PO4", description: "Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments.", attainmentPercent: "70.00", departmentId: 1 },
  { id: 5, poNumber: "PO5", description: "Modern tool usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools.", attainmentPercent: "65.00", departmentId: 1 },
  { id: 6, poNumber: "PO6", description: "The engineer and society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues.", attainmentPercent: "78.00", departmentId: 1 },
  { id: 7, poNumber: "PO7", description: "Environment and sustainability: Understand the impact of the professional engineering solutions in societal and environmental contexts.", attainmentPercent: "72.00", departmentId: 1 },
  { id: 8, poNumber: "PO8", description: "Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.", attainmentPercent: "80.00", departmentId: 1 },
  { id: 9, poNumber: "PO9", description: "Individual and team work: Function effectively as an individual, and as a member or leader in diverse teams.", attainmentPercent: "74.00", departmentId: 1 },
  { id: 10, poNumber: "PO10", description: "Communication: Communicate effectively on complex engineering activities with the engineering community and with society at large.", attainmentPercent: "69.00", departmentId: 1 },
  { id: 11, poNumber: "PO11", description: "Project management and finance: Demonstrate knowledge and understanding of the engineering and management principles.", attainmentPercent: "85.00", departmentId: 1 },
  { id: 12, poNumber: "PO12", description: "Life-long learning: Recognize the need for, and have the preparation and ability to engage in independent and life-long learning.", attainmentPercent: "77.00", departmentId: 1 },
];

const defaultPSOs = [
  { id: 1, psoNumber: "PSO1", description: "Apply knowledge of computer science and engineering principles to design, develop, and maintain software systems and applications.", departmentId: 1 },
  { id: 2, psoNumber: "PSO2", description: "Analyze, design, and implement solutions for real-world problems using modern tools and technologies in computer science.", departmentId: 1 },
  { id: 3, psoNumber: "PSO3", description: "Demonstrate professional ethics, effective communication skills, and ability to work in multidisciplinary teams.", departmentId: 1 },
];

const defaultCos = [
  { id: 1, coNumber: "CO1", description: "Understand basic data structures and their applications", bloomLevel: "Understand", attainmentPercent: "78.50", isAttained: true, subjectId: 1 },
  { id: 2, coNumber: "CO2", description: "Apply algorithms for searching and sorting", bloomLevel: "Apply", attainmentPercent: "65.00", isAttained: true, subjectId: 1 },
  { id: 3, coNumber: "CO3", description: "Analyze time and space complexity of algorithms", bloomLevel: "Analyze", attainmentPercent: "82.30", isAttained: true, subjectId: 1 },
  { id: 4, coNumber: "CO4", description: "Evaluate different algorithmic approaches for problem solving", bloomLevel: "Evaluate", attainmentPercent: "54.20", isAttained: false, subjectId: 1 },
  { id: 5, coNumber: "CO5", description: "Create efficient solutions using advanced data structures", bloomLevel: "Create", attainmentPercent: "91.00", isAttained: true, subjectId: 1 },
];

function handleMockRequest(path: string, input: any): any {
  console.log(`[tRPC Mock Request] path: ${path}`, input);
  switch (path) {
    // Auth routes
    case "auth.me": {
      const user = localStorage.getItem("obe_current_user");
      return user ? JSON.parse(user) : null;
    }
    
    case "auth.login": {
      const { email, role } = input || {};
      const user = {
        id: 1,
        unionId: `mock_${role}_${(email || "").replace(/[^a-zA-Z0-9]/g, "_")}`,
        name: (role || "admin").charAt(0).toUpperCase() + (role || "admin").slice(1) + " User",
        email: email || `${role}@obe.edu`,
        role: role || "admin",
        lastSignInAt: new Date().toISOString(),
      };
      setStorageItem("obe_current_user", user);
      return { success: true, user };
    }
    
    case "auth.logout": {
      localStorage.removeItem("obe_current_user");
      return { success: true };
    }

    // PSO routes
    case "pso.list": {
      return getStorageItem("obe_pso_list", defaultPSOs);
    }
    case "pso.create": {
      const list = getStorageItem("obe_pso_list", defaultPSOs);
      const newId = list.length > 0 ? Math.max(...list.map((item: any) => item.id)) + 1 : 1;
      const newItem = {
        id: newId,
        psoNumber: input.psoNumber,
        description: input.description,
        departmentId: input.departmentId || 1,
      };
      list.push(newItem);
      setStorageItem("obe_pso_list", list);
      return { id: newId };
    }
    case "pso.update": {
      const list = getStorageItem("obe_pso_list", defaultPSOs);
      const updatedList = list.map((item: any) => {
        if (item.id === input.id) {
          return {
            ...item,
            ...(input.psoNumber !== undefined ? { psoNumber: input.psoNumber } : {}),
            ...(input.description !== undefined ? { description: input.description } : {}),
          };
        }
        return item;
      });
      setStorageItem("obe_pso_list", updatedList);
      return { success: true };
    }
    case "pso.delete": {
      const list = getStorageItem("obe_pso_list", defaultPSOs);
      const filteredList = list.filter((item: any) => item.id !== input.id);
      setStorageItem("obe_pso_list", filteredList);
      return { success: true };
    }

    // Program Outcome routes
    case "programOutcome.list": {
      return getStorageItem("obe_po_list", defaultPOs);
    }
    case "programOutcome.update": {
      const list = getStorageItem("obe_po_list", defaultPOs);
      const updatedList = list.map((item: any) => {
        if (item.id === input.id) {
          return {
            ...item,
            ...(input.poNumber !== undefined ? { poNumber: input.poNumber } : {}),
            ...(input.description !== undefined ? { description: input.description } : {}),
            ...(input.attainmentPercent !== undefined ? { attainmentPercent: input.attainmentPercent } : {}),
          };
        }
        return item;
      });
      setStorageItem("obe_po_list", updatedList);
      return { success: true };
    }

    // Course Outcome routes
    case "courseOutcome.list": {
      return getStorageItem("obe_co_list", defaultCos);
    }
    case "courseOutcome.create": {
      const list = getStorageItem("obe_co_list", defaultCos);
      const newId = list.length > 0 ? Math.max(...list.map((item: any) => item.id)) + 1 : 1;
      const newItem = {
        id: newId,
        coNumber: input.coNumber,
        description: input.description,
        bloomLevel: input.bloomLevel,
        subjectId: input.subjectId || 1,
        attainmentPercent: "0.00",
        isAttained: false,
      };
      list.push(newItem);
      setStorageItem("obe_co_list", list);
      return { id: newId };
    }
    case "courseOutcome.update": {
      const list = getStorageItem("obe_co_list", defaultCos);
      const updatedList = list.map((item: any) => {
        if (item.id === input.id) {
          const attainment = input.attainmentPercent !== undefined ? input.attainmentPercent : item.attainmentPercent;
          return {
            ...item,
            ...(input.coNumber !== undefined ? { coNumber: input.coNumber } : {}),
            ...(input.description !== undefined ? { description: input.description } : {}),
            ...(input.bloomLevel !== undefined ? { bloomLevel: input.bloomLevel } : {}),
            attainmentPercent: attainment,
            isAttained: input.isAttained !== undefined ? input.isAttained : (parseFloat(attainment) >= 60),
          };
        }
        return item;
      });
      setStorageItem("obe_co_list", updatedList);
      return { success: true };
    }
    case "courseOutcome.delete": {
      const list = getStorageItem("obe_co_list", defaultCos);
      const filteredList = list.filter((item: any) => item.id !== input.id);
      setStorageItem("obe_co_list", filteredList);
      return { success: true };
    }

    // Dashboard routes
    case "dashboard.stats": {
      const cos = getStorageItem("obe_co_list", defaultCos);
      const pos = getStorageItem("obe_po_list", defaultPOs);
      return {
        totalStudents: 50,
        totalCourseOutcomes: cos.length,
        totalProgramOutcomes: pos.length,
        totalAssessments: 5,
        totalSubjects: 6,
        totalDepartments: 1,
        totalUsers: 3,
        pendingQuestions: 0,
      };
    }
    case "dashboard.coStats": {
      const cos = getStorageItem("obe_co_list", defaultCos);
      const attained = cos.filter((c: any) => c.isAttained).length;
      return {
        total: cos.length,
        attained,
        percentage: cos.length > 0 ? ((attained / cos.length) * 100).toFixed(1) : "0",
      };
    }
    case "dashboard.attainmentSummary": {
      const cos = getStorageItem("obe_co_list", defaultCos);
      const totalCOs = cos.length;
      const attainedCOs = cos.filter((c: any) => c.isAttained).length;
      const avgAttainment =
        totalCOs > 0
          ? (
              cos.reduce((sum: number, c: any) => sum + parseFloat(c.attainmentPercent), 0) / totalCOs
            ).toFixed(2)
          : "0.00";
      return {
        totalCOs,
        attainedCOs,
        avgAttainment,
        threshold: 60,
        studentsEvaluated: 50,
      };
    }

    default:
      console.warn(`[tRPC Mock] Unknown path: ${path}`);
      return null;
  }
}

const mockLink: TRPCLink<AppRouter> = () => {
  return ({ op }) => {
    return observable((observer) => {
      const timer = setTimeout(() => {
        try {
          const res = handleMockRequest(op.path, op.input);
          observer.next({
            result: {
              type: "data",
              data: res,
            },
          });
          observer.complete();
        } catch (err: any) {
          observer.error(err);
        }
      }, 50);
      return () => clearTimeout(timer);
    });
  };
};

const trpcClient = trpc.createClient({
  links: [mockLink],
});

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
