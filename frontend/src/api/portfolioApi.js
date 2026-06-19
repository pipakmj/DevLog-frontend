import axiosInstance from "./axiosInstance";

export const getPortfolioBuilderProjects = (page = 0, size = 20) => {
    return axiosInstance.get(`/api/portfolio-builder/projects?page=${page}&size=${size}`);
};

export const getPortfolio = (portfolioId) => {
    return axiosInstance.get(`/api/portfolios/${portfolioId}`);
};

export const getProjectPortfolio = (projectId) => {
    return axiosInstance.get(`/api/projects/${projectId}/portfolio`);
};

export const createPortfolio = (portfolioData) => {
    return axiosInstance.post("/api/portfolios", portfolioData);
};

export const updatePortfolio = (portfolioId, portfolioData) => {
    return axiosInstance.patch(`/api/portfolios/${portfolioId}`, portfolioData);
};

export const deletePortfolio = (portfolioId) => {
    return axiosInstance.delete(`/api/portfolios/${portfolioId}`);
};

export const getPortfolioAiFeedback = (portfolioData) => {
    return axiosInstance.post("/api/portfolios/ai-feedback", portfolioData, {
        timeout: 60000
    });
};

export const createPortfolioPreview = (portfolioData) => {
    return axiosInstance.post("/api/portfolios/preview", portfolioData);
};

export const downloadPortfolioPdf = (portfolioId, fileName) => {
    return axiosInstance.post(
        `/api/portfolios/${portfolioId}/pdf`,
        { fileName },
        {
            responseType: "blob",
            timeout: 60000
        }
    );
};

export const createPortfolioShareLink = (portfolioId, isPublic = true) => {
    return axiosInstance.post(`/api/portfolios/${portfolioId}/share`, { isPublic });
};

export const getSharedPortfolio = (shareToken) => {
    return axiosInstance.get(`/api/portfolios/share/${shareToken}`, {
        _silent: true
    });
};
