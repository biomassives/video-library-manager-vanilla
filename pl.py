def generate_community_hub(self):
    content = """
        <div class="space-y-6">
            <div>
                <h2 class="text-3xl font-bold">Community Hub</h2>
                <p class="text-gray-600">Connect, collaborate, and track community impact across ecosystems</p>
            </div>

            <!-- Active Community Projects -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h3 class="font-semibold text-lg mb-4">Wetland Restoration Network</h3>
                    <div class="space-y-4">
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-green-600">45</div>
                                <div class="text-sm text-gray-600">Members</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-blue-600">12</div>
                                <div class="text-sm text-gray-600">Projects</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-purple-600">89%</div>
                                <div class="text-sm text-gray-600">Success Rate</div>
                            </div>
                        </div>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between items-center">
                                <span>Latest Activity:</span>
                                <span class="text-green-600">Water Quality Assessment</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Next Event:</span>
                                <span class="text-blue-600">Community Workshop</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h3 class="font-semibold text-lg mb-4">Traditional Knowledge Circle</h3>
                    <div class="space-y-4">
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-green-600">23</div>
                                <div class="text-sm text-gray-600">Elders</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-blue-600">156</div>
                                <div class="text-sm text-gray-600">Practices</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-purple-600">95%</div>
                                <div class="text-sm text-gray-600">Verified</div>
                            </div>
                        </div>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between items-center">
                                <span>Latest Documentation:</span>
                                <span class="text-green-600">Seed Preservation</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Next Session:</span>
                                <span class="text-blue-600">Knowledge Transfer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Community Engagement Metrics -->
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="font-semibold text-lg mb-4">Engagement Metrics</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="border p-4 rounded-lg">
                        <div class="flex justify-between items-center mb-2">
                            <span>Project Participation</span>
                            <span class="text-green-600">92%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-green-600 rounded-full h-2" style="width: 92%"></div>
                        </div>
                    </div>
                    <div class="border p-4 rounded-lg">
                        <div class="flex justify-between items-center mb-2">
                            <span>Knowledge Sharing</span>
                            <span class="text-blue-600">85%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 rounded-full h-2" style="width: 85%"></div>
                        </div>
                    </div>
                    <div class="border p-4 rounded-lg">
                        <div class="flex justify-between items-center mb-2">
                            <span>Token Activity</span>
                            <span class="text-purple-600">78%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-purple-600 rounded-full h-2" style="width: 78%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activities -->
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="font-semibold text-lg mb-4">Recent Activities</h3>
                <div class="space-y-4">
                    <div class="border p-4 rounded-lg">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="font-medium">Water Quality Assessment</h4>
                                <p class="text-sm text-gray-600">Community-led monitoring of local watershed</p>
                            </div>
                            <span class="text-green-600 text-sm">Today</span>
                        </div>
                    </div>
                    <div class="border p-4 rounded-lg">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="font-medium">Traditional Farming Workshop</h4>
                                <p class="text-sm text-gray-600">Knowledge sharing session with local elders</p>
                            </div>
                            <span class="text-green-600 text-sm">Yesterday</span>
                        </div>
                    </div>
                    <div class="border p-4 rounded-lg">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4 class="font-medium">Biodiversity Survey</h4>
                                <p class="text-sm text-gray-600">Species documentation in restored areas</p>
                            </div>
                            <span class="text-green-600 text-sm">2 days ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    """
    return self.generate_header("Community Hub") + content + self.generate_footer()
