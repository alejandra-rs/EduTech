import React from "react";
import Layout from "./components/Layout";
import Courses from "./pages/AllCourses";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Subject from "./pages/AllSubjects";
import SignIn from "./pages/SignIn";
import SearchBar from "./components/SearchBar";
import PostGrid from "./components/PostGrid";

import {
    AuthenticatedTemplate,
    UnauthenticatedTemplate,
    useMsal,
} from "@azure/msal-react";

export default function App() {
    const { accounts } = useMsal();

    const isDomainValid = accounts.length > 0;

    return (
        <>
            <UnauthenticatedTemplate>
                <SignIn />
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                {isDomainValid ? (
                    <Layout>
                        <div className="mb-10 w-full">
                            <SearchBar />
                        </div>

                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Courses />} />
                                <Route
                                    path=":id/asignaturas/"
                                    element={<Subject />}
                                />
                                <Route
                                    path=":id/:subjectId/post"
                                    element={<PostGrid />}
                                />
                            </Routes>
                        </BrowserRouter>
                    </Layout>
                ) : null}
            </AuthenticatedTemplate>
        </>
    );
}
